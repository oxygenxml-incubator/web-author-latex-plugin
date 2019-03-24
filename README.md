Web Author LaTeX Plugin
=======================

An Web Author plugin that provides rendering and editing support for embedded Latex equations.

MathJax
-------

This project is based on MathJax 2.6. To keep the size within reasonable limits we removed:

- image fonts: `fonts/HTML-CSS/TeX/png/`
- context menu localization (we disable it anyway): `localization/`
- development files: `unpackaged/`
- configuration files - we use our own: `config/`
- support for SVG outout - we use HTML: `jax/output/SVG/`
- all fonts besides TeX and STIX-Web: `fonts/HTML-CSS/...`

Copyright and License
---------------------
Copyright 2019 Syncro Soft SRL.

This project is licensed under [Apache License 2.0](https://github.com/oxygenxml/web-author-mathml-plugin/blob/master/LICENSE)
