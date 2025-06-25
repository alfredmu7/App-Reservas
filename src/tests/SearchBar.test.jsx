import { beforeEach, vi } from "vitest";
import { BrowserRouter } from 'react-router-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchBlock } from '../components/SearchBlock'


global.fetch = vi.fn()

describe("SearchBlock - Búsqueda con autocompletado y calendario", () =>{
    beforeEach(() => {
        fetch.mockClear()
    })
    test("debe permitir al usuario buscar un producto con autocompletado y fechas seleccionadas", async () => {
        // Mock del autocompletado 
        fetch.mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve([
                { id: 1, name: "Electricista Nivel II" },
                { id: 2, name: "Plomero" },
              ]),
          })
        )
    
        const mockProducts = [
            { id: 1, name: "Electricista Nivel II", description: "Electricista pro", image: ["a.jpg"] },
            { id: 2, name: "Plomero", description: "Plomero pro", image: ["b.jpg"] },
          ];
        
        render(
          <BrowserRouter>
            <SearchBlock products={mockProducts}/>
          </BrowserRouter>
        )
    
      
        // Buscar el input de texto y simular escritura
        const inputBusqueda = screen.getByPlaceholderText("Ej: Electricista, Plomero...")
        fireEvent.change(inputBusqueda, { target: { value: "Electricista" } })
    
        // esperar sugerencias del autocompletado
        const suggestions = await screen.findByText('Electricista Nivel II')
        expect(suggestions).toBeInTheDocument()
    
        // Simular que el usuario selecciona una sugerencia
        fireEvent.click(suggestions)
    
        // Simular selección de fechas en calendario doble
        // Aquí usamos dos inputs,con sus calendarios
        const inputStartDate = screen.getByPlaceholderText("Desde...") 
        const inputEndDate = screen.getByPlaceholderText("Hasta...")
    
        fireEvent.change(inputStartDate, { target: { value: "2025-07-01" } })
        fireEvent.change(inputEndDate, { target: { value: "2025-07-03" } })
    
        // Mock de la búsqueda tras hacer clic en el botón
        fetch.mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve([
                { id: 101, name: "Electricista Nivel II", available: true },
              ]),
          })
        )
    
        // Hacemos clic en el botón de buscar
        const searchButton = screen.getByRole("button", { name: /buscar/i })
        fireEvent.click(searchButton)
    
        // Esperamos a que se muestren resultados de búsqueda
        const result = await screen.findByText("Electricista Nivel II")
        expect(result).toBeInTheDocument()
      })
})