package org.example.fitness.DAO;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.example.fitness.entity.User;

@Mapper
public interface UserMapper extends BaseMapper<User> {

}
