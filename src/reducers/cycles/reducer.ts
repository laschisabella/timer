import { ActionTypes } from "./actions"
import { produce } from "immer"

export interface Cycle {
	id: string
	task: string
	minutesAmount: number
	startDate: Date
	interruptedDate?: Date
	completedDate?: Date
}

interface CyclesState {
	cycles: Cycle[]
	activeCycleId: string | null
}

export function cyclesReducer (state: CyclesState, action: any) {
	switch (action.type) {

		case ActionTypes.ADD_NEW_CYCLE:
			// lib immer permite tratar state como mutavel
			return produce(state, draft => {
				draft.cycles.push(action.payload.newCycle)
				draft.activeCycleId = action.payload.newCycle.id
			})
		
		case ActionTypes.INTERRUPT_CURRENT_CYCLE: 

			// encontrar index do item que será alterado
			const currentCycleIndex = state.cycles.findIndex (cycle => {
				return cycle.id === state.activeCycleId
			})
			// caso não houver ciclo ativo (e a ação de interromper ciclo for acionada)
			// findIndex retorna -1 caso não conseguir encontrar index
			if (currentCycleIndex < 0) {
				return state
			}

			return produce(state, draft => {
					draft.activeCycleId = null
					draft.cycles[currentCycleIndex].interruptedDate = new Date()
				})
		
		case ActionTypes.MARK_CURRENT_CYCLE_AS_COMPLETED:
			
			const currentCycleIndex = state.cycles.findIndex (cycle => {
				return cycle.id === state.activeCycleId
			})
			
			if (currentCycleIndexi < 0) {
				return state
			}

			return produce(state, draft => {
					draft.activeCycleId = null
					draft.cycles[currentCycleIndex].completedDate = new Date()
				})
		default:
			return state
	}
}
