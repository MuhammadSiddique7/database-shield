export class ShieldSecurityException extends Error {
  public risk: string;
  public reason: string;
  public ruleId?: string;

  constructor(message: string, risk: string, reason: string, ruleId?: string) {
    super(message);
    this.name = 'ShieldSecurityException';
    this.risk = risk;
    this.reason = reason;
    this.ruleId = ruleId;
  }
}
