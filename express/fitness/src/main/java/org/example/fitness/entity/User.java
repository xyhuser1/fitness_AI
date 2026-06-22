package org.example.fitness.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("user")
public class User {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String nickname;
    private Integer gender;
    private LocalDate birthDate;
    private Double height;
    private Double weight;
    private String avatar;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer status;

}
