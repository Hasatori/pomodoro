import {animate, animateChild, animation, query, stagger, style, transition, trigger} from "@angular/animations";

export const listAnimation = trigger('items', [
  transition(':enter', [
    style({transform: 'scale(0.5)', opacity: 0}),  // initial
    animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
      style({transform: 'scale(1)', opacity: 1})),  // final
  ]),
]);
export const onCreateListAnimation =
  trigger('list', [
    transition(':enter', [
      query('@items', stagger(200, animateChild()),{optional:true})
    ]),
  ]);
