export interface Interaction {
  id: string;
  triggers: InteractionTrigger[];
  states: InteractionState[];
  startStateId: string;
}

export interface InteractionItemTrigger {
  itemId: string;
  type: 'item';
  triggerEvent: 'hover-in' | 'hover-out' | 'click';
  from: StateId;
  to: StateId;
}

export interface InteractionScrollTrigger {
  type: 'scroll-position';
  position: number;
  from: StateId;
  to: StateId;
  isReverse: boolean;
}

export interface InteractionItemScrollTrigger {
  itemId: string;
  type: 'item-scroll-position';
  itemPosition: 'bottom' | 'center' | 'top';
  screenPosition: 'bottom' | 'center' | 'top';
  offset: number;
  from: StateId;
  to: StateId;
  isReverse: boolean;
}

export type VideoInteractionAction = {
  type: 'play' | 'pause';
  itemId: string;
}

export interface InteractionState {
  id: StateId;
  actions?: VideoInteractionAction[];
}

type StateId = string;
export type InteractionTrigger = InteractionItemTrigger | InteractionScrollTrigger | InteractionItemScrollTrigger;
