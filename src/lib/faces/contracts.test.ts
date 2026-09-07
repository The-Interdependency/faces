import { test } from "node:test";
import { test_catalog_knobs_scoped, test_catalog_unique_ids } from "./catalog.ts";
import { test_field_slots_cover_catalog } from "./field-card.ts";
import { test_line_shares_target_feature } from "./generator.ts";
import { test_fail_resets_box, test_pass_promotes } from "./leitner.ts";

test("catalog_unique_stable_ids", () => test_catalog_unique_ids());
test("catalog_knobs_are_partial", () => test_catalog_knobs_scoped());
test("line_shares_one_feature_varies_the_rest", () => test_line_shares_target_feature());
test("leitner_fail_resets_to_box_one", () => test_fail_resets_box());
test("leitner_pass_promotes_and_spaces", () => test_pass_promotes());
test("field_slots_cover_catalog", () => test_field_slots_cover_catalog());
