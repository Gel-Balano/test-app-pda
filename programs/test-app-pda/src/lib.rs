use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("3U1szxp8AY1YCQ98gEGwjzW9ntVUUZNSAV2oKEeZRTNr");

#[program]
pub mod test_app_pda {
    use super::*;

    pub fn deposit_escrow(ctx: Context<InitializeEscrow>, params: InitializeEscrowParams) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        escrow.owner = ctx.accounts.owner.key();
        escrow.bump = ctx.bumps.escrow;
        // Transfer tokens from owner to escrow account
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.owner_token_account.to_account_info(),
                    to: ctx.accounts.escrow_token_account.to_account_info(),
                    authority: ctx.accounts.owner.to_account_info(),
                },
            ),
            params.amount,
        )?;

        Ok(())
    }

//     pub fn withdraw_from_escrow(ctx: Context<WithdrawFromEscrow>) -> Result<()> {
//         let escrow = &ctx.accounts.escrow;

//         // Ensure the withdrawer is the initializer
//         require!(
//             escrow.initializer == ctx.accounts.withdrawer.key(),
//             EscrowError::UnauthorizedWithdrawal
//         );

//         // Transfer tokens from escrow account back to initializer
//         token::transfer(
//             CpiContext::new_with_signer(
//                 ctx.accounts.token_program.to_account_info(),
//                 Transfer {
//                     from: ctx.accounts.escrow_token_account.to_account_info(),
//                     to: ctx.accounts.withdrawer_token_account.to_account_info(),
//                     authority: ctx.accounts.escrow_token_account.to_account_info(),
//                 },
//                 &[&[
//                     b"escrow",
//                     ctx.accounts.escrow.to_account_info().key.as_ref(),
//                     &[*ctx.bumps.get("escrow_token_account").unwrap()],
//                 ]]
//             ),
//             escrow.amount,
//         )?;

//         // Close the escrow account
//         ctx.accounts.escrow.close(ctx.accounts.withdrawer.to_account_info())?;

//         Ok(())
//     }
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct InitializeEscrowParams {
    pub amount: u64,
}

#[derive(Accounts)]
#[instruction(params: InitializeEscrowParams)]
pub struct InitializeEscrow<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
      mut,
      associated_token::mint = mint,
      associated_token::authority = owner,
      constraint = owner_token_account.amount >= params.amount,
    )]
    pub owner_token_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = mint,
        associated_token::authority = escrow,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    #[account(
      init_if_needed,
      payer = owner,
      seeds=[b"escrow", owner.key().as_ref()],
      bump,
      space = 8 + 8 + 32
    )]
    pub escrow: Account<'info, Escrow>,

    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// #[derive(Accounts)]
// pub struct WithdrawFromEscrow<'info> {
//     #[account(mut)]
//     pub withdrawer: Signer<'info>,
//     #[account(mut)]
//     pub withdrawer_token_account: Account<'info, TokenAccount>,
//     #[account(
//         mut,
//         seeds = [b"escrow", escrow.key().as_ref()],
//         bump,
//         token::mint = withdrawer_token_account.mint,
//         token::authority = escrow_token_account,
//     )]
//     pub escrow_token_account: Account<'info, TokenAccount>,
//     #[account(mut, has_one = owner)]
//     pub escrow: Account<'info, Escrow>,
//     pub token_program: Program<'info, Token>,
// }

#[account]
pub struct Escrow {
    pub bump: u8,
    pub owner: Pubkey,
}

#[error_code]
pub enum EscrowError {
    #[msg("Only the escrow owner can withdraw funds")]
    UnauthorizedWithdrawal,
}