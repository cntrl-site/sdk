export interface Interaction {
  id: string;
  triggers: InteractionTrigger[];
  states: InteractionState[];
  startStateId: string;
}

export interface InteractionTrigger {
  itemId: string;
  type: 'hover-in' | 'hover-out' | 'click';
  from: StateId;
  to: StateId;
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
