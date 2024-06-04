import classes from "./Input.module.css";

type props ={
    title: string,
    name?: string,
    inputType?: string,
    onChange?:  (events?: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void,

}

export default function Input({title,name,onChange, inputType = "text"}:props){
    return (
        <div className={classes.group}>
            <label className={classes.title}>{title}</label>
            {inputType === "textarea" ? 
                <textarea onChange={onChange} className={`${classes.userinput} ${classes.textarea}`} name={name}></textarea>:
                <input onChange={onChange} className={classes.userinput} name={name} type={inputType}/>
            }
        </div>
    )
}