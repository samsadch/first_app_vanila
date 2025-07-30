# Publishing to GitHub: Step-by-Step

## Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click "+" in top-right corner → "New repository"
3. Enter name: "instagram-like-camera-filters"
4. Add optional description
5. Choose public/private visibility
6. Do NOT initialize with README/gitignore/license
7. Click "Create repository"

Keep the GitHub page open for the next steps.

## Step 2: Connect Local Repository to GitHub

1. After creating the repository, GitHub will display a page with setup instructions
2. Copy the repository URL (looks like: https://github.com/yourusername/instagram-like-camera-filters.git)
3. Open terminal in your project directory
4. Run this command (replace with your actual repository URL):
   ```
   git remote add origin https://github.com/yourusername/instagram-like-camera-filters.git
   ```
5. Verify the remote connection:
   ```
   git remote -v
   ```
   You should see your GitHub URL listed

## Step 3: Push Your Code to GitHub

1. Push your code to GitHub with this command:
   ```
   git push -u origin main
   ```

2. Enter your GitHub credentials when prompted
   - If you use two-factor authentication (2FA), you'll need a personal access token
   - Create one at GitHub → Settings → Developer settings → Personal access tokens

3. After successful push, refresh your GitHub repository page
   - You should now see all your project files on GitHub
   - Your project is now published!

## Future Updates

After making changes to your project, use these commands to update your GitHub repository:

```
git add .                                # Stage all changes
git commit -m "Description of changes"   # Commit with a message
git push                                 # Push to GitHub
```

## Congratulations!

Your Instagram-like Camera Filters project is now published on GitHub. You can:
- Share the repository URL with others
- Enable GitHub Pages to create a live demo
- Continue developing and pushing updates
- Accept contributions from other developers