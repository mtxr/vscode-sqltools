# react-object-model

<p align='center'>
    <img src='./rom.png' alt='react-object-model' width='64'>
</p>

<h2 align='center'>
    react-object-model
</h2>

<p align='center'>
    <a href='https://www.npmjs.com/package/react-object-model' target='_blank'>
        <img alt='npm version' src='https://img.shields.io/npm/v/react-object-model.svg?style=flat-square&color=brightgreen' />
    </a>
    <a href='https://www.npmjs.com/package/react-object-model' target='_blank'>
        <img alt='npm downloads' src='https://img.shields.io/npm/dt/react-object-model?style=flat-square&color=brightgreen' />
    </a>
</p>


Object-oriented state management for react

- Lightweight, based merely on React hooks: `useState` and `useEffect`
- Simple and intuitive API: `const { name, age } = user.use(['name', 'age'])`
- Subscription based, diff subscribed properties, no unnecessary rerender of components


## GitHub
[https://github.com/ShenHongFei/react-object-model](https://github.com/ShenHongFei/react-object-model)


## 1. Model
### Usage

[![Edit vigilant-northcutt-8p0q4](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vigilant-northcutt-8p0q4?fontsize=14&hidenavigation=1&theme=light)

```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'

import { Model } from 'react-object-model'


function Example () {
    const { name } = user.use(['name'])
    
    const { value } = counter.use(['value'])
    
    
    return <div className='example'>
        <div className='user'>
            <h3>User:</h3>
            <div>
                <button onClick={() => {
                    // set model properties by `model.set` method
                    // (`user.name = 'Tom'` is not allowed)
                    user.set({ name: 'Tom', age: 16 })
                }}>login</button>
                
                <button onClick={() => {
                    // will not trigger rerender as we don't subscribe to user's age in this component
                    // (except for the first `user.set` call as the model doesn't know the previous state)
                    user.set({ age: Math.trunc(100 * Math.random()) })
                }}>set age</button>
                
                <button onClick={() => {
                    // but we could get current value of model's property without subscription
                    alert(user.age)
                    console.log('user.age = ', user.age)
                }}>get age</button>
                
                <button onClick={async () => {
                    // call model method to change it's state
                    await user.logout()
                    alert('user logged out')
                    console.log('user logged out')
                }}>logout (delay 2s)</button>
            </div>
            <div className='display'>user.name = {name}</div>
        </div>
        
        <div className='example-counter'>
            <h3>Counter:</h3>
            <div>
                <button onClick={() => { counter.increase() }}>+1</button>
                
                <button onClick={async () => {
                    await counter.increase_async()
                    console.log('counter.value', counter.value)
                }}>+1 (delay 2s)</button>
                
                <button onClick={() => { counter.reset() }}>reset</button>
            </div>
            <div className='display'>counter.value = {value}</div>
        </div>
        
        <div className='stats'>
            <h3>Statistics:</h3>
            <div className='detail'>
                <div>{'<'}Example{' />'} component rendered</div>
                <RenderCounter />
                <div>times</div>
            </div>
        </div>
    </div>
}

class User extends Model <User> {
    name = ''
    age = 0
    
    async logout () {
        await delay(2000)
        this.set({ name: '', age: 0 })
    }
}

let user = new User()

class Counter extends Model <Counter> {
    value = 0
    
    reset () {
        this.set({ value: 0 })
    }
    
    increase () {
        this.set({ value: this.value + 1 })
    }
    
    async increase_async () {
        await delay(2000)
        this.set({ value: this.value + 1 })
    }
}

let counter = new Counter()

async function delay (milliseconds: number) {
    return new Promise( resolve => {
        setTimeout(resolve, milliseconds)
    })
}

createRoot(
    document.querySelector('.root')
).render(
    <Example />
)
```

### Implementation
```ts
export class Model <TModel> {
    /** Map<rerender, selector> */
    protected _selectors: Map<({ }) => void, (keyof TModel)[]>
    
    /** 保存上次渲染的状态用于比较  last state */
    protected _state: any
    
    
    constructor () {
        Object.defineProperty(this, '_selectors', {
            configurable: true,
            enumerable: false,
            writable: true,
            value: new Map()
        })
        
        Object.defineProperty(this, '_state', {
            configurable: true,
            enumerable: false,
            writable: true,
            value: { }
        })
    }
    
    
    /** 像使用 react hooks 那样订阅模型属性  use and watch model's properties like react hooks  
        use 之后，通过 set 更新属性才会触发组件重新渲染  After `use`, properties updated by `set` will trigger rerender
        @param selector 订阅属性名称组成的数组  selector array of properties to watch
        @returns 模型本身  model self
        @example ```ts
            const { name, age } = user.use(['name', 'age'])
            ``` */
    use <Key extends keyof TModel> (selector?: Key[]) {
        // React guarantees that dispatch function identity is stable and won’t change on re-renders
        const [, rerender] = useState({ })
        
        useEffect(() => {
            this._selectors.set(rerender, selector)
            return () => { this._selectors.delete(rerender) }
        }, [ ])
        
        return this as any as Pick<TModel, Key>
    }
    
    
    /** 更新模型属性，diff, 重新渲染对应组件  assign properties to model then diff then rerender (when changed)
        @param data 属性  data properties
        @example ```ts
            user.set({ name: 'Tom', age: 16 })
            ``` */
    set (data: Partial<TModel>) {
        Object.assign(this, data)
        this.render()
    }
    
    
    render (diffs?: (keyof TModel)[]) {
        const set_diffs = diffs ? new Set(diffs) : null
        
        for (const [rerender, selector] of this._selectors)
            if (
                !selector || 
                selector.find(key => 
                    set_diffs ?
                        set_diffs.has(key)
                    :
                        this[key as any] !== this._state[key]
                )
            )
                rerender({ })
        
        this._state = { ...this }
    }
}
```

<hr/>



## 2. FormModel
### Usage
```tsx
import React from 'react'
import ReactDOM from 'react-dom'

import { FormModel, FormField } from 'react-object-model/form.js'


class UserForm extends FormModel <UserFormValues> {
    name = new FormField(this.form, 'name', '')
    
    age = new FormField(this.form, 'age', '0')
    
    override async submit (values: UserFormValues) {
        await delay(3000)
        console.log('submit', values)
    }
    
    override validate ({ name, age }: UserFormValues) {
        return {
            name: name ? undefined : 'name cannot be empty',
            age: Number(age) < 18 ? 'age is less than 18' : undefined,
        }
    }
}

interface UserFormValues {
    name: string
    age: string
}

let fuser = new UserForm()

// re-render only when form state (hasValidationErrors, submitting) change
function UserFormExample () {
    const { form: { hasValidationErrors, submitting, submit } } = fuser.use({ hasValidationErrors: true, submitting: true })
    
    return <>
        <Form className='form-test'>
            <NameInput />
            <AgeInput />
        </Form>
        <Form.Action>
            <Button type='primary' loading={submitting} onClick={submit}>提交 ({String(hasValidationErrors)})</Button>
        </Form.Action>
        <Counter />
    </>
}


// re-render only when name change
function NameInput () {
    const { name } = fuser
    name.use()
    
    return <Form.Item /* auto inject status and message */ {...name.item} /* label='custom label' */>
        <Input {...name.input} autoComplete='off' />
        <Form.Text>touched: {String(name.meta.touched)}, error: {name.meta.error}</Form.Text>
        <Counter />
    </Form.Item>
}

// re-render only when age change
function AgeInput () {
    const { age } = fuser
    age.use()
    
    return <Form.Item {...age.item}>
        <Input {...age.input} autoComplete='off' />
        <Form.Text>touched: {String(age.meta.touched)}, error: {age.meta.error}</Form.Text>
        <Counter />
    </Form.Item>
}

/** counter for rendered times */
function Counter () {
    const rcounter = useRef(0)
    return <div className='counter'>{++rcounter.current}</div>
}

ReactDOM.render(<UserFormExample/>, document.querySelector('.root'))
```
