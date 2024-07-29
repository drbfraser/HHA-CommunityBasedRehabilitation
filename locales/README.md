# Locales

This folder contains the translations files for all projects (`common`, `mobile` and `web`).

* Edit the `en.json` file to add/remove/edit phrases for translation.
* Edit the `bari.json` file to mirror all the phrases in `en.json`.
* Under Windows PowerShell, run `replicate_translations.ps1` to copy all translation files to the correct locations in each of the projects.

## Rationale for Centralized Translation Files

* The same phrases are used in numerous projects, so sharing one source file reduces translation work.
* Some code in `common/` references translations which are loaded by the code in that module, and hence those translations need to be in the `@cbr/commons` package. For example, the translations used in the React components (such as field names) need to be loaded by the `common` module.
* Some code in `common/` references translations which are loaded by *other* modules. For example, the form validation code in `common` is written in the `common` module, but it is then executed by the `web` or `mobile` projects, and hence the translations need to be loaded by those modules. Therefore there ends up being a complex set of rules about which translations are needed by which packages.

By having one unified translation source which is copied into each package, it will reduce duplication, confusion, and management effort. The cost is that each component will have translations in its translation file that are unused.