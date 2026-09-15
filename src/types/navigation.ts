export type AuthStackParamList = {
  Login: undefined;
  RecoveryPasswordStep1: undefined;
  RecoveryPasswordStep2: { email: string };
};

export type SANStackParamList = {
  ExplorerHome: undefined;
  SANDetails: { id: string };
};

export type ChatStackParamList = {
  ChatList: any;
  ChatDetail: { id: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Preference: undefined;
  EditProfile: undefined;
  PaymentMethods: undefined;
};

export type TabParamList = {
  UNISAN: undefined;
  Chat: undefined;
  Explorer: undefined;
  History: undefined;
  Profile: undefined;
};
