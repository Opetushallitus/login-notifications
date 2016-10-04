package fi.vm.sade.notifications;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import javaslang.collection.List;
import javaslang.control.Option;
import javaslang.control.Try;
import javaslang.jackson.datatype.JavaslangModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicReference;

@Path("/")
public class NotificationsService {

    private ObjectMapper mapper = new ObjectMapper();
    private String filePath = "";
    private AtomicReference<List<Notification>> notifications = new AtomicReference<>();

    private Logger log = LoggerFactory.getLogger("login-notifications");

    public NotificationsService() {
        mapper.registerModule(new JavaslangModule());

        try {
            String userHome = System.getProperty("user.home");
            String PROPERTY_FILE = "common.properties";
            File file = new File(userHome + "/oph-configuration/" + PROPERTY_FILE);
            Properties props = new Properties();
            props.load(new FileInputStream(file));
            filePath = props.getProperty("loginNotificationsFilePath");
        } catch (IOException e) {
            e.printStackTrace();
        }

        notifications.set(readFile());
        log.info("Service started");
    }

    private String toJson(Object o){
        StringWriter sw = new StringWriter();
        Try.run(() -> mapper.writeValue(sw, o));
        return sw.toString();
    }

    private List<Notification> readFile(){
        Try<List<Notification>> notifications = Try.of(() -> mapper.readValue(new File(filePath), new TypeReference<List<Notification>>(){}));
        log.info("Reading notifications from file:"+filePath);
        return notifications.getOrElse(List.empty());
    }

    private void writeFile(){
        File file = new File(filePath);
        log.info("Writing notifications to file: "+filePath);
        Try.run(() -> mapper.writeValue(file, notifications.get()));
    }

    private void addNotification(Notification notification){
        int maxId = notifications.get().map(Notification::getId).max().getOrElse(0);
        List<Notification> currentNotifications = notifications.get();
        notification.setId(maxId + 1);
        log.info("Adding notification: "+notification);
        notifications.set(currentNotifications.append(notification));
    }

    private void updateNotification(Notification notification){
        List<Notification> currentNotifications = notifications.get();
        List<Notification> newNotifications = currentNotifications.filter(n -> n.getId() != notification.getId()).append(notification);
        log.info("Updating notification: "+notification);
        notifications.set(newNotifications);
    }

    @GET
    @Path("notifications")
    @Produces(MediaType.APPLICATION_JSON)
    public Response notifications(){
        return Response.ok().entity(toJson(notifications.get().sortBy(Notification::getId))).build();
    }

    @DELETE
    @Path("notifications/{id}")
    public Response delete(@PathParam("id") int id){
        List<Notification> currentNotifications = notifications.get();
        List<Notification> newNotifications = currentNotifications.filter(n -> n.getId() != id);
        log.info("Deleting notification: " + id);
        notifications.set(newNotifications);
        writeFile();
        return notifications();
    }

    @POST
    @Path("notifications/add")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response add(String data){
        Option<Notification> newNotification = Try.of(() -> mapper.readValue(data, Notification.class)).toOption();
        newNotification.forEach(n -> {
            if(n.getId() <= 0){
                addNotification(n);
            }else{
                updateNotification(n);
            }
            writeFile();
        });

        return notifications();
    }
}
