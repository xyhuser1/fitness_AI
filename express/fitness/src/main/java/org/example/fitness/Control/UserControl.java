package org.example.fitness.Control;

import org.example.fitness.Service.UserService;
import org.example.fitness.DAO.UserMapper;
import org.example.fitness.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")

public class UserControl {
@Autowired
    private UserService userService;
@Autowired
    private UserMapper userMapper;
//注册逻辑
@PostMapping("/register")
public Map<String,Object> register(@RequestBody User user){
    Map<String, Object> result = new HashMap<>();
    boolean success = userService.register(user);
    if( success){
        result.put("code", 200);
        result.put("message", "注册成功！");
        result.put("data", null);
    }else{
        result.put("code", 400);
        result.put("message", "注册失败，用户名可能已存在！");
        result.put("data", null);
    }
    return result;
}
//登录逻辑
@PostMapping("/login")
    public Map<String,Object> login(@RequestBody Map<String, String> loginData){
    Map<String, Object> result = new HashMap<>();
    String username = loginData.get("username");
    String password = loginData.get("password");
    User user = userService.login(username,password);
    if( user != null){
        result.put("code", 200);
        result.put("message", "登录成功！");
        result.put("data", user);
    }else{
        result.put("code", 400);
        result.put("message", "登录失败，用户名或密码错误！");
        result.put("data", null);
    }
    return  result;
    }

//获取用户信息
@GetMapping("/{id}")
public Map<String,Object> getUserById(@PathVariable Integer id){
    Map<String, Object> result = new HashMap<>();
    User user = userMapper.selectById(id);
    if(user != null){
        user.setPassword(null); // 不返回密码
        result.put("code", 200);
        result.put("data", user);
    }else{
        result.put("code", 400);
        result.put("message", "用户不存在");
    }
    return result;
}

//更新用户信息
@PutMapping("/update")
public Map<String,Object> updateUser(@RequestBody User user){
    Map<String, Object> result = new HashMap<>();
    int rows = userMapper.updateById(user);
    if(rows > 0){
        result.put("code", 200);
        result.put("message", "更新成功");
    }else{
        result.put("code", 400);
        result.put("message", "更新失败");
    }
    return result;
}

}
