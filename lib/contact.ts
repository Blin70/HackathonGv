/**
 * The address people can write to about their data or their account.
 *
 * `null` until a real mailbox exists. The privacy policy and terms branch on
 * it rather than printing an address nobody reads: a legal page that invites
 * data requests at a dead inbox is worse than one that says there is no
 * channel yet. Set this to the mailbox and both pages pick it up.
 */
export const SUPPORT_EMAIL: string | null = null
