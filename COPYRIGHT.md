<!--
Agent Skills Compendium
Copyright © 2026 Jerson Boyd Milan
-->

# Copyright & Authorship

Copyright © 2026 Jerson Boyd Milan.

## Agent Skills Compendium

The Agent Skills Compendium was originally conceived and developed by
Jerson Boyd Milan in 2026.

The project's original materials include its:

- taxonomy of twenty capability categories
- five-layer architectural model
- standardized skill specification (the canonical schema)
- skill relationship and composition model
- original documentation and written content
- original skill definitions and examples
- information architecture
- original software implementation

Copyright in original materials remains subject to applicable law and the
license terms governing the specific material.

## Third-party materials

Third-party software, libraries, frameworks, datasets, trademarks,
documentation, and other materials remain the property of their respective
owners and are governed by their applicable licenses.

This project depends on third-party open-source software, including Next.js,
React, Tailwind CSS, Zod, and the `yaml` parser, among others. Those
dependencies are listed in `package.json` and retain their own copyright and
license terms.

This notice does not claim ownership over third-party materials.

## Licensing

The repository is licensed under the **MIT License** — see [LICENSE](LICENSE).

    MIT License
    Copyright (c) 2026 Jerson Boyd Milan

### Known inconsistency to reconcile

Each skill definition in `content/skills/` carries `license: CC-BY-4.0` in its
own metadata, and the application surfaces that declaration. This does not
match the repository's MIT LICENSE.

Both are permissive attribution licenses, but a redistributor needs to know
which governs the skill definitions. This should be resolved by either:

1. changing the `license` field in `content/skills/*.yaml` to `MIT`, so the
   whole repository is uniformly MIT; or
2. adding an explicit dual-licensing statement to `LICENSE` — MIT for the
   source code, CC-BY-4.0 for the compendium content — and keeping the
   per-file declarations.

Until resolved, treat the repository LICENSE as governing.

## Author

Jerson Boyd Milan

Website: https://jersonboydmilan.com/
