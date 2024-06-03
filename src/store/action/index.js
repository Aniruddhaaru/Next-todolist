export const login = () => ({
    type: 'LOGIN',
  });
  
  export const logout = () => ({
    type: 'LOGOUT',
  });
  
  export const addTodo = (todo) => ({
    type: 'ADD_TODO',
    payload: todo,
  });
  
  export const deleteTodo = (todoId) => ({
    type: 'DELETE_TODO',
    payload: todoId,
  });
  
  export const updateTodo = (todo) => ({
    type: 'UPDATE_TODO',
    payload: todo,
  });
  