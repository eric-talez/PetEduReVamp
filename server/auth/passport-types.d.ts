/**
 * passport 관련 타입 선언 파일
 */

// passport-kakao 모듈 타입 선언
declare module 'passport-kakao' {
  import { Strategy as PassportStrategy } from 'passport-strategy';
  
  export interface Profile {
    id: string;
    displayName: string;
    _json: {
      id: number;
      properties?: {
        nickname?: string;
        profile_image?: string;
        thumbnail_image?: string;
      };
      kakao_account?: {
        email?: string;
        phone_number?: string;
        profile?: {
          nickname?: string;
          profile_image_url?: string;
          thumbnail_image_url?: string;
        };
      };
    };
  }
  
  export interface StrategyOptions {
    clientID: string;
    clientSecret?: string;
    callbackURL: string;
    passReqToCallback?: false;
  }
  
  export interface StrategyOptionsWithRequest extends StrategyOptions {
    passReqToCallback: true;
  }
  
  export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void
  ) => void;
  
  export type VerifyFunctionWithRequest = (
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void
  ) => void;
  
  export class Strategy extends PassportStrategy {
    constructor(
      options: StrategyOptions,
      verify: VerifyFunction
    );
    constructor(
      options: StrategyOptionsWithRequest,
      verify: VerifyFunctionWithRequest
    );
    
    name: string;
    authenticate(req: any, options?: any): void;
  }
}

// passport-naver 모듈 타입 선언
declare module 'passport-naver' {
  import { Strategy as PassportStrategy } from 'passport-strategy';
  
  export interface Profile {
    id: string;
    displayName: string;
    _json: {
      id: string;
      nickname?: string;
      name?: string;
      email?: string;
      gender?: string;
      age?: string;
      birthday?: string;
      profile_image?: string;
      mobile?: string;
    };
  }
  
  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    passReqToCallback?: false;
  }
  
  export interface StrategyOptionsWithRequest extends StrategyOptions {
    passReqToCallback: true;
  }
  
  export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void
  ) => void;
  
  export type VerifyFunctionWithRequest = (
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void
  ) => void;
  
  export class Strategy extends PassportStrategy {
    constructor(
      options: StrategyOptions,
      verify: VerifyFunction
    );
    constructor(
      options: StrategyOptionsWithRequest,
      verify: VerifyFunctionWithRequest
    );
    
    name: string;
    authenticate(req: any, options?: any): void;
  }
}