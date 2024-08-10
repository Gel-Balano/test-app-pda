use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("JAqrRSvCSUkAb77kFMpwe7VXkpPSfDDpsyMwBxApNjvd");

#[program]
pub mod test_app_pda {
    use super::*;

    pub fn create_escrow(ctx: Context<CreateEscrow>, amount: u64) -> Result<()> {
      // get escrow account
      let escrow = &mut ctx.accounts.escrow;

      // set from
      escrow.from = ctx.accounts.from.key();

      // set to
      escrow.to = ctx.accounts.to.key();

      // set amount
      escrow.amount = amount;

      Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateEscrow<'info> {
  // escrow account PDA
  #[account(
    init,
    seeds = [b"escrow".as_ref(), from.key().as_ref(), to.key().as_ref()],
    bump,
    payer = from,
    space = size_of::<EscrowAccount>()
  )]

  pub escrow: Account<'info, EscrowAccount>,

  #[account(mut)]
  pub from: Signer<'info>,
  /// CHECK: safe
  // lol bypass safe check
  #[account(mut)]
  pub to: AccountInfo<'info>,

  pub system_program: Program<'info, System>
}

#[account]
pub struct EscrowAccount {
  pub from: Pubkey,
  pub to: Pubkey,
  pub amount: u64
}