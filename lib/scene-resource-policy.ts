export const sceneFreeResourcePolicy={
 ownerCore:'long-scene',currency:'VND',maximumCost:0,
 registrationEmails:['phuclongtivi1@gmail.com','phuclongtivi2@gmail.com'],
 reviewIntervalMonths:3,
 requireSource:true,requireLicense:true,requireVerifiedProviderReceipt:true,
 allowPaymentCard:false,allowPaidTrial:false,allowAutomaticRenewal:false,
} as const;
export function assessFreeResource(input:{cost:number;recurringCost:number;licenseVerified:boolean;requiresCard:boolean;trial:boolean;registrationRequired:boolean;policyExpiresAt:string},now=Date.now()){
 const expires=Date.parse(input.policyExpiresAt);
 if(!Number.isFinite(expires)||expires<=now)return 'policy_review_required';
 if(input.cost!==0||input.recurringCost!==0||input.requiresCard||input.trial||!input.licenseVerified)return 'boss_review_required';
 return input.registrationRequired?'provider_registration_required':'eligible_free_resource';
}
