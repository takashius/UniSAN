export interface Created {
  user: string;
  date: string;
}

export interface CreatedExtend {
  user: User;
  date: string;
}

export interface User {
  _id: string;
  name: string;
  lastName: string;
}

export interface LoginResponse {
  _id: string;
  name: string;
  lastName?: string;
  photo?: string;
  email: string;
  date: string;
  token: string;
}

export interface UserLogin {
  name: string;
  lastName: string;
  email: string;
  token: string;
  _id: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface Image {
  image: any;
  imageType: string;
}

export interface Recovery {
  code: Number;
  email: string;
  newPass: string;
}

export interface UserAccount {
  id: string;
  name: string;
  photo?: string;
  lastName: string;
  email: string;
  points: number;
  level: number;
  pointsNeeded: number;
}

export interface Statistics {
  activeSansCount: number;
  completedSansCount: number;
  totalSavings: number;
  totalPayments: number;
  onTimePayments: number;
  daysUntilNextPayment: number;
}

export interface San {
  _id: string;
  name: string;
  amount: number;
  frequency: string;
  paymentDates: Date[];
  isActive: boolean;
  active: boolean;
  members: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SanMin {
  id: string;
  sanName: string;
  amount: number;
  startDate: string;
  frequency: string;
  position: number;
}

export interface NextPayment {
  id: string;
  sanName: string;
  sanAmount: number;
  paymentAmount: number;
  nextPaymentDate: string;
  lastPaidTurn: number;
  currentTurn: number | null;
  isOwnTurn: boolean;
}

export interface Account {
  user: UserAccount;
  statistics: Statistics;
  sans: SanMin[];
  nextPayments: NextPayment[];
}

export interface JoinSanData {
  san: string;
  bank: string;
  amount: number;
  date: string;
  operationReference: string;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  lastName: string;
  photo: string | null;
  phone: string;
  email: string;
  documentId: string;
  imageDocumentId: string | null;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  identityNumber: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileUpdateData {
  name: string;
  lastName: string;
  documentId: string;
  phone: string;
  password?: string;
}
