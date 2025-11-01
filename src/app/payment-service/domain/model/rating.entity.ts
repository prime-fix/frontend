import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a rating method associated with a user account.
 */
export class Rating implements BaseEntity{
  /**
   * Unique identifier for the rating.
   */
  _id_rating: string;
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
  _id_auto_repair: string;
  /**
   * Identifier for the user account that provided the rating.
   */
  _id_user_account: string;

  /**
   * Creates a new Rating instance.
   * @param rating - An object containing rating details.
   */
  constructor(rating:{
    id_rating: string;
    star_rating: number;
    comment: string;
    time_rating: string;
    id_auto_repair: string;
    id_user_account: string;
  }) {
    this._id_rating = rating.id_rating;
    this._star_rating = rating.star_rating;
    this._comment = rating.comment;
    this._time_rating = rating.time_rating;
    this._id_auto_repair = rating.id_auto_repair;
    this._id_user_account = rating.id_user_account;
  }

  /** Getters and Setters */
  get id (): string { return this._id_rating; }
  set id (value: string) { this._id_rating = value; }
  get star_rating (): number{  return this._star_rating;}
  set star_rating (value: number) {  this._star_rating = value;}
  get comment (): string{  return this._comment;}
  set comment (value: string) {  this._comment = value;}
  get time_rating (): string{  return this._time_rating;}
  set time_rating (value: string) {  this._time_rating = value;}
  get id_auto_repair (): string{  return this._id_auto_repair;}
  set id_auto_repair (value: string) {  this._id_auto_repair = value;}
  get id_user_account (): string{  return this._id_user_account;}
  set id_user_account (value: string) {  this._id_user_account = value;}
}
