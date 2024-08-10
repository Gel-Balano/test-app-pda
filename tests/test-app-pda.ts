import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { TestAppPda } from "../target/types/test_app_pda";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { assert } from "chai";

describe("test-app-pda", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TestAppPda as Program<TestAppPda>;
  before(async () => {

  })

  it("Is initialized!", async () => {
    // Add your test here.

  });
});
