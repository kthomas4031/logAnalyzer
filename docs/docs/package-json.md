---
id: package-json
title: CLI Scripts
sidebar_label: Package.json
---

# Scripts

| `npm run` | Description                                                                                                                                                                                 |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `examples`            | Generate the [docusaurus examples](https://docusaurus.io/docs/en/commands#docusaurus-examples).                                                                                             |
| `start`               | Run the [development server](https://docusaurus.io/docs/en/commands#running-from-the-command-line).                                                                                         |
| `build`               | Build the [static html documentation site](https://docusaurus.io/docs/en/publishing#building-static-html-pages).                                                                            |
| `publish-gh-pages`    | Generate [Github Pages](https://docusaurus.io/docs/en/publishing#using-github-pages) site.                                                                                                  |
| `write-translations`  | [Generate translation files](https://docusaurus.io/docs/en/translation) for other languages.                                                                                                |
| `version`             | Add a [version to the documentation](https://docusaurus.io/docs/en/versioning) that corresponds to the application version so that the user can select their current version in a dropdown. |
| `rename-version`      | [Rename an existing version](https://docusaurus.io/docs/en/versioning#renaming-existing-versions) to something else.                                                                        |


# Development Dependencies

 - [Prettier][1] is an auto formatting library that can be [configured with a `.pretterrc` file][4] to auto-format code on save with compatable editors, or as a precommit hook with [Husky][2]
 - [Husky][2] implements [git hooks][3], which in combination with [Prettier][1] can be used to format code just before a commit so that all code in the repository has consistent formatting at all times

<!--Links below (example comment)-->

[1]: https://prettier.io
[2]: https://blog.vanila.io/pre-commit-git-hooks-with-husky-b2fce57d0ecd
[3]: https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks
[4]: https://prettier.io/docs/en/configuration.html
[5]: https://www.tablesgenerator.com/markdown_tables