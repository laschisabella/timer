import { differenceInSeconds } from "date-fns/esm"
import { createContext, ReactNode, useState, useReducer, useEffect } from "react"
import { addNewCycleAction, interruptCycleAction, markCycleAsCompletedAction } from "../reducers/cycles/actions"
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer"


interface CreateCycleData {
	task: string
	minutesAmount: number
}

interface CyclesContextProviderProps {
	children: ReactNode
}

interface CyclesContextType {
	cycles: Cycle[]
	activeCycle: Cycle | undefined
	activeCycleId: string | null
	amountSecondsPassed: number
	markCurrentCycleAsCompleted: () => void
	setSecondsPassed: (seconds: number) => void
	createNewCycle: (data: CreateCycleData) => void
	interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

	/* =====================================================

		Reducer:
		Reduz vários estados interligados num hook só
		Usar no lugar de vários 'useState'

		Parâmetros:
			1) Função que recebe todas as modificações dos estados
			2) Objeto de inicialiazação dos estados
			3) Função que é disparada assim que reducer é criado, para recuperar dados iniciais de algum lugar

	*/
	const [cyclesState, dispatch] = useReducer(
		cyclesReducer, 
		{ // inicialização
			cycles: [],
			activeCycleId: null,
		},
		() => {
			const storedStateAsJSON = localStorage.getItem('@timer:cycles-state-1.0.0')
			// se houver algo em storedStateAsJSON
			if (storedStateAsJSON) {
				return JSON.parse(storedStateAsJSON)
			}

			return {
				cycles: [],
				activeCycleId: null
			}
		}
	)
	// =====================================================

	const { cycles, activeCycleId } = cyclesState
	const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

	// estado que conta quantos segundos se passaram desde o inicio da tarefa, inicia em 0 caso nao houver activeCycle do storage do navegador
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
		if (activeCycle) {
			return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
		}
		return 0
	})


	// Salvar informações no storage do navegador
	useEffect (() => {
		
		const stateJSON = JSON.stringify(cyclesState)
		// salva no local storage ("@timer:cycles-state-1.0.0" para especificar bem o que é guardado)
		localStorage.setItem('@timer:cycles-state-1.0.0', stateJSON)
	}, [cyclesState])

	function setSecondsPassed(seconds: number) {
		setAmountSecondsPassed(seconds)
	}

	function markCurrentCycleAsCompleted(){
		dispatch(markCycleAsCompletedAction())
	}
	

	function createNewCycle(data: CreateCycleData){
		const newCycle: Cycle = {
			id: String(new Date().getTime()),
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date()
		}

		dispatch(addNewCycleAction(newCycle))

		// reseta segundos passados 
		setAmountSecondsPassed(0)
	}

	function interruptCurrentCycle() {
		dispatch(interruptCycleAction())		
		document.title = "timer"
	}

	return (
		<CyclesContext.Provider 
          value={{
			cycles,
            activeCycle, 
            activeCycleId, 
            amountSecondsPassed,
            markCurrentCycleAsCompleted, 
            setSecondsPassed,
			createNewCycle,
			interruptCurrentCycle,
          }}
        >
			{children}
		</CyclesContext.Provider>
	)
}