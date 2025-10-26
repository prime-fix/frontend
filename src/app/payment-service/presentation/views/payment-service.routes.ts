import {Routes} from '@angular/router'

const paymentPage = () => import('./payment/payment').then(m=>m.Payment)
const paymentSelection = () => import('./payment-selection/payment-selection').then(m=>m.PaymentSelection)
const paymentForm = () => import('./payment-form/payment-form').then(m=>m.PaymentForm)
const paymentDone = () => import('./payment-done/payment-done').then(m=>m.PaymentDone)
const ratingPage = () => import('./rating/rating').then(m=>m.Rating)
const ratingForm = () => import('./rating-form/rating-form').then(m=>m.RatingForm)
const ratingDone = () => import('./rating-done/rating-done').then(m=>m.RatingDone)

export const paymentServiceRoutes: Routes = [
  { path: 'payment', loadComponent:paymentPage},
  { path: 'payment/selection', loadComponent:paymentSelection},
  { path: 'payment/form', loadComponent:paymentForm},
  { path: 'payment/done', loadComponent:paymentDone},
  { path: 'rating', loadComponent:ratingPage},
  { path: 'rating/form', loadComponent:ratingForm},
  { path: 'rating/done', loadComponent:ratingDone}
]
