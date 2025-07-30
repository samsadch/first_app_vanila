# GitHub Repository Setup Guide

## Creating a GitHub Repository

1. **Sign in to GitHub**: Go to [github.com](https://github.com) and sign in to your account (or create one if you don't have it).

2. **Create a new repository**:
   - Click on the "+" icon in the top-right corner
   - Select "New repository"
   - Enter a repository name (e.g., "instagram-like-camera-filters")
   - Add an optional description
   - Choose public or private visibility
   - Do NOT initialize with README, .gitignore, or license (since we already have these locally)
   - Click "Create repository"

3. **After creating the repository**, GitHub will show instructions for the next steps. We'll use these in the following steps to connect your local repository.

## Connecting Your Local Repository to GitHub

1. **Copy the repository URL**:
   - On your GitHub repository page, click the "Code" button
   - Copy the HTTPS URL (e.g., https://github.com/yourusername/instagram-like-camera-filters.git)

2. **Connect your local repository to GitHub**:
   - Open your terminal in your project directory
   - Run the following command, replacing the URL with your repository URL:
     ```
     git remote add origin https://github.com/yourusername/instagram-like-camera-filters.git
     ```

3. **Push your code to GitHub**:
   - Run the following command to push your code to the main branch:
     ```
     git push -u origin main
     ```
   - Enter your GitHub username and password or personal access token when prompted
   
   Note: If you're using GitHub authentication with 2FA, you'll need to use a personal access token instead of your password. You can create one in GitHub under Settings > Developer settings > Personal access tokens.

4. **Verify your repository**:
   - Refresh your GitHub repository page
   - You should now see all your project files on GitHub

## Future Updates

After making changes to your project, use these commands to update your GitHub repository:

```
git add .
git commit -m "Description of your changes"
git push
```