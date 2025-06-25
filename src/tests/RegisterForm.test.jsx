import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {  it, expect, vi } from "vitest";
import { RegisterForm } from '../components/RegisterForm';

it("should register a user successfully", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve("Registro exitoso. ¡Bienvenido!"),
      })
    );
  
    render(<RegisterForm />);
  
    // Llenar campos para que la validación pase
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { name: "name", value: "Alfred" },
    });
  
    fireEvent.change(screen.getByLabelText(/apellidos/i), {
      target: { name: "lastName", value: "Muñoz" },
    });
  
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { name: "email", value: "alfred@test.com" },
    });
  
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { name: "password", value: "Abcdef1!" },
    });
  
    // Hacer submit del formulario
    fireEvent.submit(screen.getByRole("button", { name: /registrarse/i }));
  
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
  