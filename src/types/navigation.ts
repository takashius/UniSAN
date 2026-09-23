export type AuthStackParamList = {
  Login: undefined;
  RecoveryPasswordStep1: undefined;
  RecoveryPasswordStep2: { email: string };
  Terms: undefined;
};

export type SANStackParamList = {
  ExplorerHome: undefined;
  SANDetails: { id: string };
};

export type ChatStackParamList = {
  ChatList: undefined;
  ChatDetail: { id: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Preference: undefined;
  EditProfile: undefined;
  PaymentMethods: undefined;
  Terms: undefined;
  PendingPayments: undefined;
  PendingPaymentDetail: { id: string };
  PendingDocuments: undefined;
  PendingDocumentDetail: { userId: string };
};

export type TabParamList = {
  UNISAN: undefined;
  Chat: undefined;
  Explorer: undefined;
  History: undefined;
  Profile:
    | {
        screen?: keyof ProfileStackParamList;
        params?: ProfileStackParamList[keyof ProfileStackParamList];
      }
    | undefined;
};
