# Locales

This folder contains the translations files for all projects (`common`, `mobile` and `web`).

* Edit the `en.json` file to add/remove/edit phrases for translation.
* Edit the `bari.json` file to mirror all the phrases in `en.json`.
* Run `copy_translations.cmd` / `copy_translations.sh` to copy all translation files to the correct locations in each of the projects.

## Rationale for Centralized Translation

* The same phrases are used in numerous projects
* Some code in `common/` references translations which are loaded by the code in that module, and hence those translations need to be in the `@cbr/commons` package. For example, translations used in the React components need to be loaded by the `common` module.
* Some code in `common/` references translations which are loaded by *other* modules. For example, the form validation code in `common` is coded in that module, but is then executed later by the `web` or `mobile` projects, and hence the translations need to be loaded by those modules. Hence, there ends up being a complex set of rules about which translations are needed by which packages.

By having one unified translation source, it will reduce duplication, confusion, and management effort.