import { differenceInSeconds } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { CyclesContext } from "../../../contexts/CyclesContext";

import { CountdownContainer, Separator } from "./styles";

export function CountDown() {

	const { activeCycle, activeCycleId, markCurrentCycleAsCompleted, amountSecondsPassed, setSecondsPassed } = useContext(CyclesContext)

	// constante que transforma os minutos recebidos do formulario em segundos
	const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

	// useEffect countdown
	useEffect(() => {
		let interval: number
	
		if (activeCycle) {
		interval = setInterval(() => {
			const secondsDifference = differenceInSeconds(new Date(), new Date(activeCycle.startDate))
			
			if (secondsDifference >= totalSeconds) {

				markCurrentCycleAsCompleted()
				setSecondsPassed(totalSeconds)
				clearInterval(interval)
			} else {
				setSecondsPassed(secondsDifference)
			}
		  }, 1000)
		}
	
		return () => {
		  // limpar intervalo anterior
		  clearInterval(interval)
		}
	  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsCompleted, setSecondsPassed])
	
	const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
	
	const clockMinutes = Math.floor(currentSeconds / 60)
	const clockSeconds = currentSeconds % 60 // operador de resto
	
	// Transformar em string, necessário 2 carac, se não tiver, completar com 0 no começo
	const minutes = String(clockMinutes).padStart(2, '0') 
	const seconds = String(clockSeconds).padStart(2, '0')
	
	// Coloca countdown no title da tab
	useEffect(() => {
	if (activeCycle){
		document.title = `${minutes}:${seconds}`
	}
	}, [minutes, seconds, activeCycle])	

	return (
		<CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>
	)
}