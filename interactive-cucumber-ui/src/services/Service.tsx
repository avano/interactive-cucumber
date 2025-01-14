import { editor } from "monaco-editor";
import { AlertManager } from "react-alert";
import { CucumberContextType } from "../data/CucumberContext";
import { NamingService } from "./NamingService";
import { RunScriptService } from "./RunScriptService";
import { RunStepService } from "./RunStepService";
import { TagService } from "./TagService";

export interface Service {
    canHandle(model : editor.ITextModel, lineNum : number) : boolean
    execute(model : editor.ITextModel, lineNum : number, command? : string) : void
}

class ServiceManagerImpl implements Service {
    
    alert: AlertManager
    cucumber: CucumberContextType
    
    constructor(alert: AlertManager, cucumber : CucumberContextType){
        this.alert = alert
        this.cucumber = cucumber

        this.services.push(new RunStepService(this.alert, this.cucumber))
        this.services.push(new NamingService(this.cucumber))
        this.services.push(new TagService(this.cucumber))
        this.services.push(new RunScriptService(this.alert, this.cucumber))
    }

    findService(model: editor.ITextModel, lineNum: number) : Service | undefined {
        return this.services.find((svc) => svc.canHandle(model, lineNum))
    }

    canHandle(model: editor.ITextModel, lineNum: number): boolean {
        const svc =  this.findService(model, lineNum)
        return svc !== undefined
    }
    

    execute(model: editor.ITextModel, lineNum: number, command?: string): void {
        const svc = this.findService(model, lineNum)
        if (svc) {
            svc.execute(model, lineNum, command)
        } else {
            this.alert.error(`Can't find a service to handle line '${model.getLineContent(lineNum)}'`)
        }
    }

    services : Service[] = []
}

export let ServiceManager : ServiceManagerImpl

export function initServices(alert: AlertManager, cucumber : CucumberContextType) : ServiceManagerImpl {
    ServiceManager = new ServiceManagerImpl(alert, cucumber)
    return ServiceManager
} 