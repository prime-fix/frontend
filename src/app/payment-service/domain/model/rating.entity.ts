import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a rating method associated with a user account.
 */
export class Rating implements BaseEntity{
  /**
   * Unique identifier for the rating.
   */
  _id: number;
  /**
   * Star rating given by the user.
   */
  _star_rating: number;
  /**
   * Comment provided by the user.
   */
  _comment: string;
  /**
   * Timestamp of when the rating was created.
   */
  _time_rating: string;
  /**
   * Identifier for the associated auto repair service.
   */
  _auto_repair_id: number;
  /**
   * Identifier for the user account that provided the rating.
   */
  _user_account_id: number;

  /**
   * Creates a new Rating instance.
   * @param rating - An object containing rating details.
   */
  constructor(rating:{
    id: number;
    star_rating: number;
    comment: string;
    time_rating: string;
    auto_repair_id: number;
    user_account_id: number;
  }) {
    this._id = rating.id;
    this._star_rating = rating.star_rating;
    this._comment = rating.comment;
    this._time_rating = rating.time_rating;
    this._auto_repair_id = rating.auto_repair_id;
    this._user_account_id = rating.user_account_id;
  }

  /** Getters and Setters */
  get id (): number { return this._id; }
  set id (value: number) { this._id = value; }
  get star_rating (): number{  return this._star_rating;}
  set star_rating (value: number) {  this._star_rating = value;}
  get comment (): string{  return this._comment;}
  set comment (value: string) {  this._comment = value;}
  get time_rating (): string{  return this._time_rating;}
  set time_rating (value: string) {  this._time_rating = value;}
  get auto_repair_id (): number{  return this._auto_repair_id;}
  set auto_repair_id (value: number) {  this._auto_repair_id = value;}
  get user_account_id (): number{  return this._user_account_id;}
  set user_account_id (value: number) {  this._user_account_id = value;}
}
