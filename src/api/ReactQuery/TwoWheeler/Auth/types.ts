import { ApiResponse, BaseModule } from '..';

export type VersionCheckRequest = {
  supportativeVersion: string;
} | null;

type ModuleAccess = {
  id: null | number;
  moduleId: number;
  roleId: number;
  accessId: null | number;
  read: boolean;
  write: boolean;
  hide: boolean;
};

export type LoginResponse = {
  employeeId: string;
  employeeName: string;
  rolecode: string;
  l1MangagerEmplyeeCode: string;
  businessSourcing: string;
  franchiseId: string;
  roleDescription: string;
  branch: string;
  franchiseName: string;
  moduleAccess?: ModuleAccess[];
  isUpdated: boolean;
} | null;

export type VersionCheckResponse = {
  appVersion: string;
  appVersionflag: boolean;
  hashkey: string;
} | null;

export type LoginRequest = {
  employeeId: string;
  password: string;
  deviceId: string;
} | null;


export type GetUpdatePasswordResponse = {
  count: number;
} | null;

export type MasterLoginRequest = {
  productType: string;
  appId: string;
} | null;

export type MasterLoginResponse = {
  message: string;
  isNextEnable: boolean;
} | null;


export type AuthType = BaseModule & {
  VersionCheck: (
    request: VersionCheckRequest,
  ) => Promise<ApiResponse<VersionCheckResponse>>;
  Login: (request: LoginRequest) => Promise<ApiResponse<LoginResponse>>;
  GetUpdatePassword: (id: string) => Promise<ApiResponse<GetUpdatePasswordResponse>>;
  MasterLogin: (request: MasterLoginRequest) => Promise<ApiResponse<MasterLoginResponse>>;

};
