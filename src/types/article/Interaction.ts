export interface Interaction {
  id: string;
  triggers: InteractionTrigger[];
  states: InteractionState[];
}

export interface InteractionTrigger {
  itemId: string;
  type: 'hover-on' | 'hover-on-off' | 'click';
  from: StateId;
  to: StateId;
}

export interface InteractionState {
  id: StateId;
}

type StateId = string;
