# Prospera Super — Calculadora de Maturidade Comercial (Fix)

- Build: `vite build` (sem `tsc -b` no CI)
- Node 20 fixado: `netlify.toml` + `.nvmrc`
- Slider compatível com `defaultValue` (uncontrolled)
- Badge aceita `variant`

## Deploy
- Conecte o repo na Netlify (build: `npm run build`, publish: `dist`) ou
- Use Netlify CLI:
  ```bash
  npm i -g netlify-cli
  netlify init
  npm run build
  netlify deploy --prod --dir=dist
  ```
