# Cyber Guardian

Build a dark-themed, high-tech Cloud Monitoring & Auto-Recovery Dashboard for Problem Statement "CF-PS-49: Single-Incident Cloud Auto-Recovery".

Theme & Styling:
- Dark mode cyberpunk/terminal aesthetic (#0d1117 background, neon green/emerald accents, orange/red alerts).
- Header showing Project Title: "CF-PS-49: SINGLE-INCIDENT CLOUD AUTO-RECOVERY", Status: "CONFIRMATION LOCKED // FINAL", and Receipt ID: "cef03d2c-891b-42b1-a83b-15daf669ef53".

Key Features & Sections:
1. Target Service Status Card:
   - Target Service: AWS EC2 Web Server (or AWS Lambda / Azure App Service).
   - Health Status Badge: Toggleable between "HEALTHY" (Green), "TRIGGERED / FAULT DETECTED" (Red), and "RECOVERING" (Yellow).
   - Metric Gauge: CPU Utilization % (Threshold set at > 85%).

2. Incident & Recovery Configuration Panel:
   - Non-Production Resource: `demo-web-instance-01`
   - Failure Condition: CPU Load Spike (> 85% for 60 seconds)
   - Recovery Action: Automated Instance Restart / Auto-scaling replacement via AWS CloudWatch Alarm + AWS Systems Manager / Lambda trigger.
   - Guardrail Policy: "Max 1 auto-recovery per 15 mins. If recovery fails or repeats, escalate to human administrator."

3. Live Simulation Controls (Interactive):
   - Button: "Inject Controlled Fault" (Simulates CPU spike > 85%).
   - Button: "Trigger Recovery Action" (Simulates automated restart).
   - Button: "Reset Environment" (Restores system to healthy state).

4. Incident Recovery Timeline & Telemetry Log:
   - Display a real-time event log capturing:
     - Stamp 1: Alert Triggered (Time, CPU Level)
     - Stamp 2: Automated Recovery Executed
     - Stamp 3: Health Signal Verified (Service Healthy)
     - Stamp 4: Time to Recover (MTTR in seconds, e.g., "MTTR: 42s")

5. Guardrail & Human Override Notice:
   - A callout banner: "GUARDRAIL ACTIVE: Automated retry limit set to 1. Repeated failures will require manual admin override."

Ensure all components are interactive with smooth state transitions, simulated live log updates, and clean typography suitable for a live hackathon demonstration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/933d0c4a-f2f8-4650-97dd-edd4dce417e5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
