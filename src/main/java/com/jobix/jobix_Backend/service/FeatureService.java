package com.jobix.jobix_Backend.service;

import com.jobix.jobix_Backend.model.Feature;
import com.jobix.jobix_Backend.repository.FeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeatureService {

    @Autowired
    private FeatureRepository featureRepository;



    public List<Feature> getAllFeature(){
        return  featureRepository.findAll();
    }

    public  Feature createFeature(Feature feature){
        return featureRepository.save(feature);
    }


//buscamos feature por id, si no la encuentra lanazamos exception, si sí, actualizamos los campos de name e icon
    public Feature updateFeature(Long id, Feature updateFeature){
        Feature feature = featureRepository.findById(id).orElseThrow(() -> new RuntimeException("Caracteristica no encontrada"));
        feature.setName(updateFeature.getName());
        feature.setIcon(updateFeature.getIcon());
        return featureRepository.save(feature);
    }

    public void deleteFeature(Long id){
        featureRepository.deleteById(id);
    }


    public List<Feature> findAllById(List<Long> id) {
        return featureRepository.findAllById(id);
    }

}
