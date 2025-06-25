import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddProductForm from '../pages/AddProductForm';
import { vi } from 'vitest';

//TEST #1
//CASO DE PRUEBA: Poder registrar productos exitosamente
/* "Como admin quiero crear productos"

Criterios de aceptación:
Se puede ingresar nombre, descripción, imágenes, categoría y características.
El sistema valida los campos requeridos.
*/

global.fetch = vi.fn((url) => {
  if (url.includes("/api/categories")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1, name: "Categoría Test" }]),
    });
  }

  if (url.includes("/api/features")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 101, name: "diurna" }]),
    });
  }

  // Simula respuesta exitosa del envío del producto
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: "Producto creado" }),
  });
});

describe("AddProductForm - Registro de productos", () => {
  test("should register a product successfully", async () => {
    render(<AddProductForm />); // eRenderizamos el formulario

    //  Completamos el nombre del producto
    const nameInput = await screen.findByLabelText(/nombre/i);
    await userEvent.type(nameInput, "Servicio de plomería");

    //  Completamos la descripción
    const descInput = screen.getByLabelText(/descripción/i);
    await userEvent.type(descInput, "Plomería para hogar y oficina");

    //  Esperamos que se cargue y seleccionamos categoría
    const categorySelect = await screen.findByLabelText(/categoría/i);
    fireEvent.change(categorySelect, { target: { value: "1" } });

    //  Seleccionamos una característica (ejemplo: disponibilidad diurna)
    const featureCheckbox = await screen.findByLabelText(/diurna/i);
    fireEvent.click(featureCheckbox);

    //  Simulamos carga de imagen
    const file = new File(["dummy"], "foto.jpg", { type: "image/jpeg" });
    const imageInput = screen.getByLabelText(/imágenes/i); //este texto debe coincidir
    await userEvent.upload(imageInput, file);

    //  Enviamos el formulario
    const submitButton = screen.getByRole("button", { name: /guardar/i });
    await userEvent.click(submitButton);

    //mensaje de éxito
    await waitFor(() =>
      expect(screen.getByText(/producto agregado exitosamente/i)).toBeInTheDocument()
    );
  });
});

