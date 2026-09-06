# pro-v3

1. Open the local pro-v3 repository.
2. Create branch: `git switch -c webcore-rc`
3. Copy/overlay all files from this folder into the repo. Do not delete other existing files.
4. Run `npm install` then `npm run build`.
5. If build passes: `git add .` then `git commit -m "Web Core RC: i18n Lavender navigation and integration"` then `git push -u origin webcore-rc`.
6. Check Vercel Preview. Only then merge into main.
