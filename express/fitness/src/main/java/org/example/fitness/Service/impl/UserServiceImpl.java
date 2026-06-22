package org.example.fitness.Service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.example.fitness.DAO.UserMapper;
import org.example.fitness.Service.UserService;
import org.example.fitness.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

//注册逻辑
    @Override
    public boolean register(User user) {
        //1.判断用户名是否存在
        User existUser = findByUsername(user.getUsername());
        if(existUser != null){
            return false;
        }
        //2.数据加密

        //3.设置用户状态
        user.setStatus(1);
       //4.保存用户
        int result = userMapper.insert(user);
        return result > 0;
    }

    @Override
    public User login(String username, String password) {
        //1.判断用户是否存在
        User user = findByUsername(username);
        //不存在就返回null
        if (user == null) {
            return null;
        }
        //2.判断用户状态
        if (user.getStatus() == 0) {
            return null;
        }
        //3.密码匹配
        if (!user.getPassword().equals(password)) {
            return null;
        }
        //4.返回用户（不返回密码）
        user.setPassword(null);
        return user;
    }

    @Override
    public User findByUsername(String username) {
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.eq("username", username);  // 相当于SQL: where username = ?
        return userMapper.selectOne(wrapper);  // 查询一条记录
    }
}
