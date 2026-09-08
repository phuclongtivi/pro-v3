# R4B7 Pro ↔ Mobi Action Conflict Audit

## Result

- Pro: 153/153 source button contracts mapped; 0 duplicate literal IDs; 0 duplicate dynamic patterns; 0 static IDs inside list rendering; 0 dead buttons.
- Mobi: 153/153 source button contracts mapped; 0 duplicate literal IDs; 0 duplicate dynamic patterns; 0 static IDs inside list rendering; 0 dead buttons.
- Navigation/action arrays: 0 duplicate sibling IDs, 0 duplicate sibling Vietnamese labels, 0 duplicate sibling English labels and 0 duplicate object keys.
- Cross-surface: 151 normalized contracts intentionally share semantics while retaining separate `pro.*` and `mobi.*` namespaces.
- Pro-only controls: Boss login and Connect control-plane refresh.
- Mobi-only controls: direct event creation and TV pair-token entry.

## Conflicts resolved

- Replaced the reduced Mobi Action Control Plane with the same receipt-validation rules used by Pro.
- Restored signed receipt verification, six-core trace and explicit production gating on Mobi.
- Removed obsolete user-facing `END` wording from Mobi actions.
- Removed the obsolete Mobi `Thu/Chi của tôi` branch.
- Forced both Store surfaces to open `store.shopping` / full warehouse by business ID instead of array position.

Equivalent actions across Pro and Mobi are not duplicates: their surface namespaces are distinct and each invocation/receipt retains its own full Action ID.
