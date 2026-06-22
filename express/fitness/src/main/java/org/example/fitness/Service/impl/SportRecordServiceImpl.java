package org.example.fitness.Service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.fitness.DAO.SportMapper;
import org.example.fitness.Service.SportRecordService;
import org.example.fitness.entity.SportRecord;
import org.springframework.stereotype.Service;

@Service
public class SportRecordServiceImpl extends ServiceImpl<SportMapper, SportRecord> implements SportRecordService {

}
