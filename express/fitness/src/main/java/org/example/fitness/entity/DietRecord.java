package org.example.fitness.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("diet_record")
public class DietRecord {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer userId;
    private LocalDate recordDate;
    private String mealType;
    private String foodName;
    private Integer calories;
    private LocalDateTime createdAt;



}
