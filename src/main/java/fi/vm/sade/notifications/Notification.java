package fi.vm.sade.notifications;

public class Notification {

    private int id = -1;
    private String text_fi;
    private String text_sv;

    public Notification(){}

    public Notification(int id,String text_fi, String text_sv){
        this.id = id;
        this.text_fi = text_fi;
        this.text_sv = text_sv;
    }

    public String getText_fi() {
        return text_fi;
    }

    public void setText_fi(String text_fi) {
        this.text_fi = text_fi;
    }

    public String getText_sv() {
        return text_sv;
    }

    public void setText_sv(String text_sv) {
        this.text_sv = text_sv;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String toString(){
        return "id: " + id + " fi: " + text_fi + " sv: " + text_sv;
    }
}
