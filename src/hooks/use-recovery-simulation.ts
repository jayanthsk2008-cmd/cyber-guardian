import { useEffect, useRef, useState } from 'react';

export type Health = 'healthy' | 'triggered' | 'recovering';
export type LogEntry = { id: number; time: string; level: 'INFO' | 'WARN' | 'ERROR' | 'OK'; message: string };
const baseline = [23, 25, 22, 28, 24, 26, 21, 23, 27, 24, 30, 25, 24, 28, 23, 26, 29, 24, 25, 22, 27, 24, 28, 26, 25, 23, 29, 26, 24, 27, 23, 24];

export function useRecoverySimulation() {
  const [health, setHealth] = useState<Health>('healthy');
  const [cpu, setCpu] = useState(24);
  const [samples, setSamples] = useState(baseline);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [clock, setClock] = useState('—');
  const [elapsed, setElapsed] = useState(0);
  const [mttr, setMttr] = useState<number | null>(null);
  const [phase, setPhase] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [escalated, setEscalated] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const lastRecovery = useRef(0);
  const id = useRef(0);
  const recoveryTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const healthRef = useRef<Health>('healthy');
  const setStatus = (next: Health) => { healthRef.current = next; setHealth(next); };
  const addLog = (level: LogEntry['level'], message: string) => {
    const entry = { id: ++id.current, time: new Date().toISOString().slice(11, 19), level, message };
    setLogs(prev => [...prev, entry].slice(-100));
  };
  const stopRecovery = () => { if (recoveryTimer.current) clearInterval(recoveryTimer.current); recoveryTimer.current = null; };

  useEffect(() => {
    addLog('INFO', 'Monitoring agent connected · demo-web-instance-01');
    addLog('INFO', 'CloudWatch alarm armed · CPU > 85% / 60s');
    addLog('OK', 'Health check passed · HTTP 200 · latency 124ms');
    const interval = setInterval(() => {
      setClock(new Date().toISOString().slice(11, 19));
      setCooldown(Math.max(0, Math.ceil((lastRecovery.current + 900000 - Date.now()) / 1000)));
      const value = healthRef.current === 'triggered' ? 92 + Math.round(Math.random() * 6) : healthRef.current === 'recovering' ? null : 21 + Math.round(Math.random() * 9);
      if (value !== null) { setCpu(value); setSamples(prev => [...prev.slice(1), value]); }
    }, 1500);
    return () => { clearInterval(interval); stopRecovery(); };
  }, []);

  const inject = () => {
    stopRecovery(); setStatus('triggered'); setCpu(96); setSamples(prev => [...prev.slice(1), 96]);
    setPhase(1); setElapsed(0); setMttr(null);
    addLog('WARN', 'Controlled CPU fault injected · CPU 96%');
    addLog('ERROR', 'ALARM triggered · threshold exceeded for 60 simulated seconds');
    if (lastRecovery.current && Date.now() - lastRecovery.current < 900000) {
      setEscalated(true); addLog('ERROR', 'Repeated incident · automatic recovery locked · administrator required');
    }
  };
  const recover = () => {
    if (healthRef.current !== 'triggered') return;
    if (lastRecovery.current && Date.now() - lastRecovery.current < 900000) {
      setEscalated(true); addLog('ERROR', 'Guardrail blocked retry · max 1 recovery per 15 minutes'); return;
    }
    lastRecovery.current = Date.now(); setCooldown(900); setAttempts(prev => prev + 1);
    setStatus('recovering'); setPhase(2); addLog('INFO', 'Recovery executed · Systems Manager instance restart dispatched');
    let tick = 0;
    recoveryTimer.current = setInterval(() => {
      tick += 1; const seconds = tick * 7; setElapsed(seconds);
      const value = Math.max(24, 96 - tick * 12); setCpu(value); setSamples(prev => [...prev.slice(1), value]);
      if (tick === 3) addLog('INFO', 'Instance restarting · waiting for healthy response');
      if (tick >= 6) {
        stopRecovery(); setStatus('healthy'); setPhase(4); setMttr(42);
        addLog('OK', 'Health signal verified · HTTP 200 · CPU 24%');
        addLog('OK', 'Incident resolved · MTTR: 42s · recovery complete');
      }
    }, 1000);
  };
  const reset = () => {
    stopRecovery(); lastRecovery.current = 0; setCooldown(0); setStatus('healthy'); setCpu(24); setSamples(baseline);
    setPhase(0); setElapsed(0); setMttr(null); setAttempts(0); setEscalated(false); setLogs([]);
    addLog('INFO', 'Demo environment reset · simulated incident and guardrail window cleared');
    addLog('OK', 'Service healthy · monitoring resumed');
  };
  const selectHealth = (next: Health) => {
    if (next === 'triggered') inject();
    else if (next === 'recovering') { if (healthRef.current === 'healthy') inject(); recover(); }
    else { stopRecovery(); setStatus('healthy'); setCpu(24); setPhase(0); addLog('OK', 'Manual health signal set · retry guardrail retained'); }
  };
  return { health, cpu, samples, logs, clock, elapsed, mttr, phase, attempts, escalated, cooldown, inject, recover, reset, selectHealth };
}