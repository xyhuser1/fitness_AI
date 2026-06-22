package org.example.fitness.Service;

import org.example.fitness.entity.User;

public interface UserService {
    //传进来一个user对象，成功就true 失败就false
    boolean register(User user);
    //传进来用户名和密码，成功就返回一个user对象，失败就返回null
    User login(String username,String password);
    //根据用户名查询信息
    User findByUsername(String username);

}
