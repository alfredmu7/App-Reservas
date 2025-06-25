package com.jobix.jobix_Backend.service;


import com.sendgrid.*; // Este importa Email, Content, Mail, SendGrid, etc. se eliminó clave, por seguridad
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;




@Service
public class EmailService {

    // se eliminó la clave para confirmar correos post-reserva
    // inyecta la API key desde el properties
    //@Value("${sendgrid.api.key}")
    private String sendgridApiKey;

    //Envía un correo de confirmación de reserva al usuario
    public void sendReservationConfirmationEmail(String toEmail, String subject, String contentText) throws IOException {
        // Remitente (puede ser un correo verificado o genérico)
        Email from = new Email("example@confirmmessage.com");// se cambió el correo que estaba registrado con SendGrid
        Email to = new Email(toEmail);
        Content content = new Content("text/plain", contentText);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendgridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            System.out.println("STATUS: " + response.getStatusCode());
            System.out.println("BODY: " + response.getBody());
            System.out.println("HEADERS: " + response.getHeaders());

        } catch (IOException ex) {
            throw new IOException("Error al enviar el correo: " + ex.getMessage(), ex);
        }
    }

}
