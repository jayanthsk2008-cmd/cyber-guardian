<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the cloud incident simulation in a dedicated client hook; no real cloud API mutations are performed by demo controls.
- Recovery consumes one 15-minute retry window, which manual status selection preserves; only explicit demo reset clears it.
- Use semantic CSS tokens for the console, with route-level metadata on every content page.
