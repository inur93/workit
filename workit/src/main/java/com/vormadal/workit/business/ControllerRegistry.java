package com.vormadal.workit.business;


import com.vormadal.workit.business.impl.*;

public class ControllerRegistry {

    private static PolicyController policyController;
    private static ResourceController resourceController;
    private static RoleController roleController;

    private static UserController userController;
    private static ClientController clientController;
    private static ProjectController projectController;
    private static CaseController caseController;
    private static TimeRegistrationController timeRegistrationController;

    public static UserController getUserController(){
        if (userController==null){
            userController=new UserControllerImpl();
        }
        return userController;
    }


    public static ClientController getClientController(){
        if(clientController == null) clientController = new ClientControllerImpl();
        return clientController;
    }

    public static ProjectController getProjectController(){
        if(projectController == null) projectController = new ProjectControllerImpl();
        return projectController;
    }

    public static CaseController getCaseController() {
        if(caseController == null) caseController = new CaseControllerImpl();
        return caseController;
    }

    public static TimeRegistrationController getTimeRegistrationController() {
        if(timeRegistrationController == null) timeRegistrationController = new TimeRegistrationControllerImpl();
        return timeRegistrationController;
    }

    public static PolicyController getPolicyController() {
        if(policyController == null) policyController = new PolicyControllerImpl();
        return policyController;
    }

    public static ResourceController getResourceController() {
        if(resourceController == null) resourceController = new ResourceControllerImpl();
        return resourceController;
    }

    public static RoleController getRoleController() {
        if(roleController == null) roleController = new RoleControllerImpl();
        return roleController;
    }
}
