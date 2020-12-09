# Resume.md

Simple markdown resume boilerplate

# How it works

- Clone the repo
- You edit the resume.md file
- Select a base theme (via markdown comments)
- Add your own `.scss` files to the `styles/custom` folder

## Installation

```bash
npm run build
```

## Live preview mode

```bash
npm run dev
```

## Generate pdf

```
$> npm run build
```

Will create the `generated/resume.pdf` file

## Selecting base theme

Add a comment at the top of _resume.md_ as such:

```markdown
<!-- @theme foghorn -->

```
